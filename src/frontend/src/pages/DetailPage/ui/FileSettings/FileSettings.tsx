import { observer } from 'mobx-react-lite'
import { FC, useId } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { cn, isEmpty } from '@/shared/lib'
import { BaseForm, Button, Form } from '@/shared/ui'
import { detailPageStore } from '../../model'
import {
	FIELDS_CARD,
	formSchema,
	optionsIgnoreNoiseOutliers,
	optionsIgnoreSoundOutliers,
} from './constant'

interface FileSettingsProps {
	fileId: string
}

export const FileSettings: FC<FileSettingsProps> = observer(({ fileId }) => {
	const formId = useId()
	const form = useForm<z.infer<typeof formSchema>>({
		values: detailPageStore.getSetting(fileId),
		disabled:
			!isEmpty(detailPageStore.getUpload(fileId)) ||
			detailPageStore.isPreparingFile(fileId),
	})

	const onSubmit = async (payload: z.infer<typeof formSchema>) => {
		await detailPageStore.updateFileSetting(fileId, payload)
	}

	return (
		<div
			className={cn(
				'grid transition-all duration-300',
				detailPageStore.getToggleSetting(fileId)
					? 'grid-rows-[1fr]'
					: '!mt-0 grid-rows-[0fr]',
			)}
		>
			<div className="overflow-hidden">
				<div className="space-y-2 rounded-md border p-3 py-2">
					<Form {...form}>
						<form
							id={formId}
							className="flex flex-col space-y-2"
							onSubmit={form.handleSubmit(onSubmit)}
						>
							<div className="flex gap-3">
								<BaseForm.BaseFieldSlider
									step={0.1}
									min={0.2}
									max={1.5}
									className="w-1/3"
									{...FIELDS_CARD.window_size}
								/>
								<BaseForm.BaseFieldSlider
									step={0.1}
									min={0.1}
									max={1.5}
									className="w-1/3"
									{...FIELDS_CARD.window_step}
								/>
								<BaseForm.BaseFieldSlider
									step={0.01}
									min={0.7}
									max={1}
									className="w-1/3"
									{...FIELDS_CARD.confidence_limit}
								/>
							</div>
							<div className="flex gap-3">
								<BaseForm.BaseFieldSlider
									min={0}
									step={0.01}
									max={2}
									className="w-1/2"
									{...FIELDS_CARD.min_sound_length}
								/>
								<BaseForm.BaseFieldSlider
									step={1}
									min={0}
									max={50}
									labelTbumb={(value) => `${value}%`}
									className="w-1/2"
									{...FIELDS_CARD.offset_bounds}
								/>
							</div>
							<div className="flex gap-3">
								<BaseForm.BaseFieldSelect
									className="w-1/2"
									options={optionsIgnoreSoundOutliers}
									{...FIELDS_CARD.ignore_sound_outliers}
								/>
								<BaseForm.BaseFieldSelect
									className="w-1/2"
									options={optionsIgnoreNoiseOutliers}
									{...FIELDS_CARD.ignore_noise_outliers}
								/>
							</div>
						</form>
					</Form>
					<div className="flex gap-3">
						<Button
							form={formId}
							type="submit"
							className="w-full"
							disabled={form.formState.disabled || form.formState.isSubmitting}
						>
							Сохранить
						</Button>
						<Button
							className="w-full"
							variant="destructive"
							onClick={() => form.reset(detailPageStore.getSetting(fileId))}
							disabled={form.formState.disabled}
						>
							Сбросить
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
})
